export class User {
  constructor(
    id = "",
    name = "",
    email = "",
    contactNumber = "",
    profileImageUrl = "",
    role = ""
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.contactNumber = contactNumber;
    this.profileImageUrl = profileImageUrl;
    this.role = role;
  }

  toFirebase() {
    return {
      name: this.name,
      email: this.email,
      contactNumber: this.contactNumber,
      profileImageUrl: this.profileImageUrl,
      role: this.role,
    };
  }
}

export class Employee extends User {
  constructor(
    id = "",
    name = "",
    email = "",
    contactNumber = "",
    profileImageUrl = "",
    role = "Employee",
    resumeimageUrl = "",
    workExp = [],
    education = [],
    skills = []
  ) {
    super(id, name, email, contactNumber, profileImageUrl, role);
    this.resumeimageUrl = resumeimageUrl;
    this.workExp = workExp;
    this.education = education;
    this.skills = skills;
  }

  toFirebase() {
    return {
      ...super.toFirebase(),
      resumeimageUrl: this.resumeimageUrl,
      workExp: this.workExp,
      education: this.education,
      skills: this.skills,
    };
  }
}

export class Employer extends User {
  constructor(
    id = "",
    name = "",
    email = "",
    contactNumber = "",
    profileImageUrl = "",
    role = "Employer",
    isVerified = false,
    companyPermitOrRegUrl = ""
  ) {
    super(id, name, email, contactNumber, profileImageUrl, role);
    this.isVerified = isVerified;
    this.companyPermitOrRegUrl = companyPermitOrRegUrl;
  }

  toFirebase() {
    return {
      ...super.toFirebase(),
      isVerified: this.isVerified,
      companyPermitOrRegUrl: this.companyPermitOrRegUrl,
    };
  }
}