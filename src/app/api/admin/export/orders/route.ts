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

        const [res] = await conn.execute("SELECT o.id, o.number, o.total, o.quantity, o.order_on, o.status, c.email, (SELECT CONCAT(house, ', ', barangay, ', ',city, ', ', province) FROM addresses WHERE id = o.address_id) AS address FROM orders AS o JOIN customers AS c ON c.id = o.customer_id;");
        const p = createExcel(res);
        return Response.json({path: p});
    } catch (error) {
        console.log(error)
    } finally {
        conn?.release();
    }
}

const statusList: any = {
  1: "Pending",
  2: "To Receive",
  3: "Received",
  4: "Cancelled"
}

function createExcel(data: any) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Products');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Order Number', key: 'number', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Address', key: 'address', width: 60 },
    { header: 'Total Items', key: 'items', width: 12 },
    { header: 'Order Total', key: 'total', width: 12 },
    { header: 'Status', key: 'status', width: 15 }
  ];

  data.forEach((row: any) => {
    worksheet.addRow({
      id: row.id,
      number: row.number,
      email: row.email,
      address: row.address,
      items: row.quantity,
      total: row.total,
      status: statusList[row.status]
    });
  });

  workbook.xlsx.writeFile('./public/orders_report.xlsx');
  return "/orders_report.xlsx";
}