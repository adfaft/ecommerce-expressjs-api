import mongoose from "mongoose"
import z from "zod";

export const objectid_refine = {
    check: (value: string) : unknown => mongoose.Types.ObjectId.isValid(value), 
    params: { message : 'Not a valid ObjectId' } 
};


export const REGEX_OBJECTID = /^[A-Fa-f0-9]{24}$/i;
export const REGEX_UUID_WITHOUT_DASHES = /^[0-9A-F]{32}$/i;
export const REGEX_UUID_WITH_DASHES = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
export const REGEX_UUID_WITH_OR_WITHOUT_DASHES = /^([0-9A-F]{32})|([0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12})$/i;

export const REGEX_SLUG = /[A-Za-z0-9_\-]/;

export const REGEX_ALNUM = /[A-Za-z0-9]/;


export const password_superRefine = ( password: string, checkPassComplexity: z.RefinementCtx<string>) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    let errObj = {
      upperCase: { pass: true, message: "add upper case." },
      lowerCase: { pass: true, message: "add lower case." },
      specialCh: { pass: true, message: "add special ch." },
      totalNumber: { pass: true, message: "add number." },
    };

    if (countOfLowerCase < 1) {
      errObj = { ...errObj, lowerCase: { ...errObj.lowerCase, pass: false } };
    }
    if (countOfNumbers < 1) {
      errObj = {
        ...errObj,
        totalNumber: { ...errObj.totalNumber, pass: false },
      };
    }
    if (countOfUpperCase < 1) {
      errObj = { ...errObj, upperCase: { ...errObj.upperCase, pass: false } };
    }
    if (countOfSpecialChar < 1) {
      errObj = { ...errObj, specialCh: { ...errObj.specialCh, pass: false } };
    }

    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: JSON.stringify(errObj),
      });
    }
  };