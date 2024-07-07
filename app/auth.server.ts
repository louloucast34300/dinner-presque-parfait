import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import User from "./models/User"
import bcrypt from "bcryptjs"

type User = {
    username:string,
    password:string
}
const authenticator = new Authenticator<User>(sessionStorage);

const formStrategy = new FormStrategy(async ({form}) =>{

    const username = form.get("username") as string;
    const password = form.get("password") as string;

    const user = await User.findOne({username});
    if(!user){
        console.log("username not found");
        throw new AuthorizationError();
    }
    const goodPassword = await bcrypt.compare(password, user.password); // bcrypt compare
    if(!goodPassword){
        console.log("invalid password");
        throw new AuthorizationError();
    }
    console.log(user)
    return user;
});

authenticator.use(formStrategy, "form");
export {authenticator};