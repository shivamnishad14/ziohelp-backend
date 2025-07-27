// import React from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// interface UserFormData {
//   name: string;
//   email: string;
//   password: string;
//   role: string;
//   productId: number;
// }

// interface UserFormProps {
//   formData: UserFormData;
//   setFormData: (data: UserFormData) => void;
//   products?: any[];
//   roles?: any[];
// }

// const UserForm: React.FC<UserFormProps> = ({ formData, setFormData, products, roles }) => {
//   return (
//     <div className="space-y-4">
//       <div>
//         <Label>Name</Label>
//         <Input
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           placeholder="Enter full name"
//         />
//       </div>
//       <div>
//         <Label>Email</Label>
//         <Input
//           type="email"
//           value={formData.email}
//           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           placeholder="Enter email address"
//         />
//       </div>
//       <div>
//         <Label>Password</Label>
//         <Input
//           type="password"
//           value={formData.password}
//           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//           placeholder="Enter password"
//         />
//       </div>
//       <div>
//         <Label>Role</Label>
//         <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {roles?.map((role: any) => (
//               <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div>
//         <Label>Product</Label>
//         <Select value={formData.productId.toString()} onValueChange={(value) => setFormData({ ...formData, productId: Number(value) })}>
//           <SelectTrigger>
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             {products?.map((product: any) => (
//               <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//     </div>
//   );
// };

// export default UserForm;
