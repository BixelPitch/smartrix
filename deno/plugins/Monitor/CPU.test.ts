import { assertNotEquals } from "../../depts.ts";
import { CPU } from "./CPU.ts";

Deno.test({
    name: 'if getLoad works',
    fn: async () => {
        const cpu = new CPU();
        let load = await cpu.getLoad();
        assertNotEquals(load, null);
    },
    sanitizeResources: false,
    sanitizeOps: false
});