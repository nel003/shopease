
export function usernameIsValid(value: string): [boolean, string] {
    const reg = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/

    if(value.length < 3 || value.length > 20) {
        return[false, "Username must be atleast 3 - 20 characters"]
    }

    if(!reg.test(value)) {
        return[false, "Invalid username"]
    }

    return[true, ""]
} 

export function emailIsValid(value: string): [boolean, string] {
    const reg = /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if(value.length < 6 || value.length > 60) {
        return[false, "Invalid email address"]
    }

    if(!reg.test(value)) {
        return[false, "Invalid email address"]
    }

    return[true, ""]
} 

export function passwordIsValid(value: string): [boolean, string] {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(value.length < 6 || value.length > 200) {
        return[false, "Password must be atleast 8 characters"]
    }

    if(!reg.test(value)) {
        return[false, "Password must contains atleast 1 uppercase, 1 lowercase, 1 number and 1 symbol"]
    }

    return[true, ""]
} 