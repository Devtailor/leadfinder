import { Injectable } from '@nestjs/common';
const XLSX = require('xlsx');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getLinkedInUrls(): Map<Number, string> {
    const workbook = XLSX.readFile('src/data/sample-list.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const linkedinUrls = new Map<Number, string>();

    for (let index = 0; index < 10; index++)
      linkedinUrls.set(
        index,
        <string>(<Record<string, unknown>>data[index])['linkedin'],
      );

    return linkedinUrls;
  }
}
