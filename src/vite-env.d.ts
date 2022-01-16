/// <reference types="vite/client" />


declare type Obj<T = any> = { [key: string]: T }

declare type UndefinAble<T = any> = undefined | T

declare type NullAble<T> = null | T
