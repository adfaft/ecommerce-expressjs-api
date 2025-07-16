import mongoose from "mongoose";

describe('test', () => {

    it('valid object id : 0123456789', function(){

        expect(mongoose.Types.ObjectId.isValid("0123456789")).toBe(false);

    });

    it('valid object id : 0123456789ab', function(){
        expect(mongoose.Types.ObjectId.isValid("0123456789ab")).toBe(false);

    });

     it('valid object id : zzzzzzzzzzzz', function(){
        expect(mongoose.Types.ObjectId.isValid("zzzzzzzzzzzz")).toBe(false);
    });

    it('valid object id : ffffffffffffffffffffffff', function(){
        expect(mongoose.Types.ObjectId.isValid("ffffffffffffffffffffffff")).toBe(true);
    });

    it('test expect opttional chaining deep object', () => {
        let objects = {
            data: [
                { sample: "halo"}
            ],
            data2 : {},
            // data3: undefined
        };

        expect(objects.data[0].sample).toBe("halo");
        // expect(objects.data2[0]?.sample).toBe("halo");
        expect(objects.data3?.[0]?.sample).not.toBe("halo");
    });
});