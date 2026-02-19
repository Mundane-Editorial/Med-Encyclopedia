import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../lib/mongodb";
import AdminUser from "../models/AdminUser";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();

        const admin = await AdminUser.findOne({ email: credentials?.email });

        if (!admin) return null;

        const isValid = await bcrypt.compare(
          credentials!.password,
          admin.password,
        );

        if (!isValid) return null;

        return {
          id: admin._id.toString(),
          email: admin.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
