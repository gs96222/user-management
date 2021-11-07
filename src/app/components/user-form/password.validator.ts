import { FormControl } from '@angular/forms';
import { REGEX } from 'src/app/constants/constants';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    public static strong(control: FormControl): ValidationResult {
        let hasNumber = REGEX.number.test(control.value);
        let hasUpper = REGEX.Upper.test(control.value);
        let hasLower = REGEX.Lower.test(control.value);
        let hasSpecial = REGEX.Special.test(control.value);
        const valid = hasNumber && hasUpper && hasLower && hasSpecial;
        if (!valid) {
            // return what´s not valid
            return { strong: true };
        }
        return null;
    }
}