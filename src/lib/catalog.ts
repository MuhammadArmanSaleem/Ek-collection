export type Product = {id:string;slug:string;name:string;price:number;fabric:'lawn'|'cotton'|'linen';style:'embroidered'|'printed'|'plain';pieces:number;stock:number;description:string;image?:string}
export const products: Product[] = []
// Add verified EK Collection product details and images here before accepting orders.
// Example: {id:'ek-001',slug:'...',name:'...',price:3500,fabric:'lawn',style:'printed',pieces:3,stock:10,description:'...',image:'/products/example.jpg'}
export const policies: Record<string,{title:string;body:string[]}> = {
'terms-and-conditions':{title:'Terms & Conditions',body:['Product colors may vary slightly depending on photography and screen settings.','Product prices and availability must be confirmed by EK Collection before an order is finalized.','Delivery charges and timelines will be confirmed directly with the customer.']},
'return-refund-policy':{title:'Returns & Refunds',body:['Report damaged, defective or incorrect items within 7 days of delivery.','Items must be unused and in original packaging. Cut or stitched fabric is not eligible for return.','Change-of-mind returns and sale-item returns are not accepted.','Approved refunds or exchanges are processed after inspection and subject to availability. Delivery charges are assessed according to the reason for return.']},
'contact':{title:'Contact EK Collection',body:['For product inquiries, delivery details and order support, please contact EK Collection through its official WhatsApp channel.']}
}