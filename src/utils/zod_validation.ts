import mongoose from "mongoose"

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