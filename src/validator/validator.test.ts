import { object, array, string, ValidationError } from './index';

describe('Validate Arrays', () => {
    it('should pass valiator', () => {
        const testSchema = object({
            children: array().of(
                object({
                    name: string().required(),
                }),
            ),
        });
        testSchema.validateSync({});
    });
    it('should throw error', () => {
        const testSchema = object({
            children: array()
                .of(
                    object({
                        name: string().required(),
                    }),
                )
                .required(),
        });

        expect(testSchema.validateSync({})).toThrow();
    });

    it('should pass', () => {
        const testSchema = object({
            children: array()
                .of(
                    object({
                        name: string().required(),
                    }),
                )
                .required(),
        });
        testSchema.validateSync({ children: [] });
    });
});
