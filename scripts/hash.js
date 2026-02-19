import bcrypt from "bcrypt";

const password = "P@$$_k3^_med";
bcrypt.hash(password, 10).then((hash) => console.log(hash));
