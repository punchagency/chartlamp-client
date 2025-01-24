import { ReactiveVar, makeVar } from "@apollo/client";


export const uploadModalVar: ReactiveVar<boolean> = makeVar<boolean>(false);
export const deleteModalVar: ReactiveVar<boolean> = makeVar<boolean>(false);
export const shareModalVar: ReactiveVar<boolean> = makeVar<boolean>(false);
export const customTagModalVar: ReactiveVar<boolean> = makeVar<boolean>(false);
