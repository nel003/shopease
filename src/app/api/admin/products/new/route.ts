import pool from "@/database/connection"
import { writeFileSync } from "fs";
import mysql, { ResultSetHeader } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

type Variants = {
    name: string,
    values: string[]
}

function combineVariants(variants: any[]) {
    if (variants.length === 0) return [];
  
    const result: any[] = [];
    const combine = (index: number, currentCombination: any[]) => {
      if (index === variants.length) {
        result.push(currentCombination);
        return;
      }
  
      const currentAttribute = variants[index];
      for (const value of currentAttribute.values) {
        combine(index + 1, [...currentCombination, { [currentAttribute.name]: value }]);
      }
    };
  
    combine(0, []);
    return result;
  }

export async function POST(req: Request) {
    let conn;
    try {
        conn = await pool.getConnection();

        const fd = await req.formData();
        const productName = fd.get("productName");
        const category = fd.get("category");
        const thumbnail = fd.get("thumbnail") as File;
        const description = fd.get("description");
        const variants: Variants[] = JSON.parse(fd.get("variants") as string) || [];
        const previews = fd.getAll("previews[]") as File[];

        const variantsWithID: any[] = [];

        const newTNname = uuidv4()+thumbnail.name;
        writeFileSync("public/uploads/"+newTNname, Buffer.from(await thumbnail.arrayBuffer()));
        const [pres] =  await conn.execute<ResultSetHeader>("INSERT INTO products VALUES (0, ?, ?, ?, ?, ?);", [productName, category, description, 0, "/uploads/"+newTNname]);
        
        for(const file of previews) {
            const newFileName = uuidv4()+file.name;
            writeFileSync("public/uploads/"+newFileName, Buffer.from(await file.arrayBuffer()));
            await conn.execute("INSERT INTO product_files VALUES (0, ?, ?);", ["/uploads/"+newFileName, pres.insertId]);
        }
        
        for(const variant of variants) {
            const [vres] = await conn.execute<ResultSetHeader>("INSERT INTO variants VALUES (0, ?, ?);", [variant.name, pres.insertId]);
            const vaObj: any = {};
            const va: any[] = [];
            for(const val of variant.values) {
                const obj: any = {};
                const [ores] = await conn.execute<ResultSetHeader>("INSERT INTO variant_options VALUES (0, ?, ?, ?);", [val, vres.insertId, pres.insertId]);
                obj["value"] = val;
                obj["id"] = ores.insertId;
                va.push(obj);
            }
            vaObj["name"] = variant.name;
            vaObj["values"] = va;
            vaObj["variant_id"] = vres.insertId;
            variantsWithID.push(vaObj);
        }

        const combinedVariants = combineVariants(variantsWithID);
        for(const cv of combinedVariants){
            const name = (cv.map((i: any) => {
                const key = Object.keys(i)[0];
                return i[key].value
            })).join(", ");
            const ids = (cv.map((i: any) => {
                const key = Object.keys(i)[0];
                return i[key].id
            })).join("-");
            
            const [peres] = await conn.execute<ResultSetHeader>("INSERT INTO product_entry VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?);", [ids, null, name, 999999, 999999, 0, 999999, pres.insertId]);
        }   
        
        await conn.commit();

        return Response.json({message: "success", id: pres.insertId});
    } catch (error: any) {
        console.log(error) 
        await conn?.rollback();
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        await conn?.release();
    }
    
}