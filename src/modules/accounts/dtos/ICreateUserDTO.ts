export default interface ICreateUserDTO {
  name: string;
  password: string;
  email: string;
  id?: string;
  isShopkeeper: boolean;
}
