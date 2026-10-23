import type { CollectionConfig } from 'payload'
const admin = ({ req }: any) => req.user?.collection === 'users' && req.user?.role === 'admin'
const staff = ({ req }: any) => req.user?.collection === 'users' && ['admin','staff'].includes(req.user?.role)
const initialAdmin = ({ req }: any) => req.user === null
export const Users: CollectionConfig = { slug: 'users', auth: true, admin: { useAsTitle: 'email' }, access: { read: staff, create: ({ req }: any) => !req.user || admin({ req }), update: admin, delete: admin }, fields: [{ name: 'role', type: 'select', defaultValue: 'staff', options: ['admin','staff'], required: true }] }
export const Customers: CollectionConfig = { slug: 'customers', auth: true, access: { create: () => true, read: ({ req }) => !!req.user && (req.user.collection === 'users' || req.user.collection === 'customers'), update: ({ req }) => !!req.user, delete: admin }, fields: [{ name: 'name', type: 'text' }, { name: 'phone', type: 'text' }] }
export const Media: CollectionConfig = { slug: 'media', upload: { mimeTypes: ['image/*'] }, access: { read: () => true, create: admin, update: admin, delete: admin }, fields: [{ name: 'alt', type: 'text', required: true }] }
export const Categories: CollectionConfig = { slug: 'categories', access: { read: () => true, create: admin, update: admin, delete: admin }, fields: [{ name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, required: true }, { name: 'description', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }] }
export const Products: CollectionConfig = { slug: 'products', access: { read: ({ req }) => req.user?.collection === 'users' ? true : { status: { equals: 'published' } }, create: admin, update: admin, delete: admin }, fields: [
  { name: 'name', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true },
  { name: 'status', type: 'select', options: ['draft','published'], defaultValue: 'draft', required: true },
  { name: 'description', type: 'textarea' }, { name: 'price', type: 'number', min: 0, required: true },
  { name: 'stock', type: 'number', min: 0, required: true, defaultValue: 0 },
  { name: 'fabric', type: 'select', options: ['lawn','cotton','linen'], required: true },
  { name: 'style', type: 'select', options: ['embroidered','printed','plain'], required: true },
  { name: 'pieces', type: 'number', defaultValue: 3 },
  { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
  { name: 'images', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
  { name: 'featured', type: 'checkbox', defaultValue: false }
] }
export const Orders: CollectionConfig = { slug: 'orders', access: { read: staff, create: staff, update: staff, delete: admin }, fields: [
  { name: 'reference', type: 'text', required: true, unique: true },
  { name: 'customerName', type: 'text', required: true }, { name: 'email', type: 'email' },
  { name: 'phone', type: 'text', required: true }, { name: 'address', type: 'textarea', required: true },
  { name: 'city', type: 'text', required: true },
  { name: 'paymentMethod', type: 'select', options: ['cod','bank','jazzcash','easypaisa'], required: true },
  { name: 'paymentStatus', type: 'select', options: ['unpaid','pending_verification','paid','refunded'], defaultValue: 'unpaid' },
  { name: 'status', type: 'select', options: ['pending','confirmed','shipped','delivered','cancelled'], defaultValue: 'pending' },
  { name: 'items', type: 'array', required: true, fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'nameSnapshot', type: 'text', required: true }, { name: 'priceSnapshot', type: 'number', required: true }, { name: 'quantity', type: 'number', required: true }
  ] }, { name: 'subtotal', type: 'number', required: true }, { name: 'shipping', type: 'number', required: true }, { name: 'total', type: 'number', required: true }
] }
export const Pages: CollectionConfig = { slug: 'pages', access: { read: () => true, create: admin, update: admin, delete: admin }, fields: [
  { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true }, { name: 'content', type: 'richText' }
] }
