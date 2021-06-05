export default interface ICreateUserDTO {
  name: string;
  password: string;
  email: string;
  cpfOrCnpj: string;
  confirmedEmail?: boolean;
  id?: string;
  isShopkeeper: boolean;
}
