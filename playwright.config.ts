import {defineConfig} from "@playwright/test";
export default defineConfig({testDir:"./tests/browser",workers:1,timeout:90000,use:{baseURL:process.env.TEST_ORIGIN||"http://localhost:3000",browserName:"chromium",launchOptions:{args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]}},reporter:"list"});
