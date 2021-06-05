export default interface ICreateUserDTO {
  name: string;
  password: string;
  email: string;
  cpfOrCnpj: string;
  id?: string;
  isShopkeeper: boolean;
}
