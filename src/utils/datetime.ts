const getAge = (dateString: string, now:string|null = null) : number  => {
    var today = typeof now === 'string' ? new Date(now) : new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export {
    getAge
};