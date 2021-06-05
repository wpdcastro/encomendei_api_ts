export default interface ICreateUserDTO {
  name: string;
  password: string;
  email: string;
  cpf: string;
  confirmedEmail?: boolean;
  id?: string;
  isShopkeeper: boolean;
}
