export class Person {
  public id: number; // Add the id property
  public name: string;
  public email: string;
  public phone: number;
  public address: string;

  constructor(id: number, name: string, email: string, phone: number, address: string) {
    this.id = id; // Initialize id in the constructor
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

//   public greet(): string {
//     return `Hello, my name is ${this.name}. Email: ${this.email}, Phone Number: ${this.phone}, Address: ${this.address}`;
//   }
}
