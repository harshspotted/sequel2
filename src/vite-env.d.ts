// This file is a TypeScript declaration file

declare const compilerOptions: {
  typeRoots: string[];
};

const options: compilerOptions = {
  typeRoots: ["./src/types", "./node_modules/@types"],
};
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
