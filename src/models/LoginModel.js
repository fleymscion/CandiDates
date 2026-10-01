import { Employee, Employer } from "./userModel";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export class Login {
  constructor(username = "", password = "", role = "Employee", rememberMe = false) {
    this.username = username;
    this.password = password;
    this.role = role; 
    this.rememberMe = rememberMe;
  }

  validate() {
    const errors = {};

    if (this.username.trim().length === 0) {
      errors.username = "Username is required.";
    } else if (this.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (this.password.length === 0) {
      errors.password = "Password is required.";
    } else if (this.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}

export class Signup {
  constructor(
    username = "",
    email = "",
    password = "",
    confirmPassword = "",
    role = "Employee"
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.role = role; 
  }

  validate() {
    const errors = {};

    if (this.username.trim().length === 0) {
      errors.username = "Username is required.";
    } else if (this.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (this.email.trim().length === 0) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(this.email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (this.password.length === 0) {
      errors.password = "Password is required.";
    } else if (this.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (this.confirmPassword.length === 0) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (this.confirmPassword !== this.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }

  toUser() {
    const Account = this.role === "Employer" ? Employer : Employee;
    return new Account("", this.username.trim(), this.email.trim());
  }
}