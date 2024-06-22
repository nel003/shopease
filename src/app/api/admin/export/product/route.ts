import getPool from '@/database/connection';
import ExcelJS from 'exceljs';

const products = [{
    id: 1,
    name: "sd",
    price: 90,
    description: "sddsdsd"
}]

export async function GET() {
    let conn;
    try {
        
        conn = await getPool.getConnection();

        const [res] = await conn.execute("SELECT pe.id, p.product_name, p.description, pe.name AS variant, pe.stock, pe.price FROM product_entry AS pe JOIN products AS p ON p.id = pe.product_id ORDER BY stock ASC;");
        const p = createExcel(res);
        return Response.json({path: p});
    } catch (error) {
        console.log(error)
    } finally {
        conn?.release();
    }
}

function createExcel(data: any) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Products');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Product Name', key: 'name', width: 30 },
    { header: 'Variant', key: 'variant', width: 30 },
    { header: 'Price', key: 'price', width: 10 },
    { header: 'Stocks', key: 'stock', width: 10 },
    { header: 'Description', key: 'description', width: 40 }
  ];

  data.forEach((row: any) => {
    worksheet.addRow({
      id: row.id,
      name: row.product_name,
      variant: row.variant,
      price: row.price,
      stock: row.stock,
      description: row.description
    });
  });

  workbook.xlsx.writeFile('./public/products_report.xlsx');
  return "/products_report.xlsx";
}