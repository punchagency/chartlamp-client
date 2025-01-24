import { ReactiveVar, makeVar } from "@apollo/client";


export const successAlertVar: ReactiveVar<string> = makeVar<string>("");
export const errorAlertVar: ReactiveVar<string> = makeVar<string>("");