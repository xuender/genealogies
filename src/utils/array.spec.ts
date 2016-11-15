import { shallowProperty } from './array.ts';
describe('数组', () => {
    it('测试', () => {
        let o = {a: 'ff'};
        expect(shallowProperty(o, 'a')).toEqual('ff');
        expect(o['a']).toEqual('ff');
    });
    it('测试2', () => {
        expect(false).toEqual(false);
    });
});
