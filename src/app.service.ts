import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getLinkedInUrls(): Map<number, string> {
    const workbook = XLSX.readFile('src/data/sample-list.xlsx');
    const [sheetName] = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const linkedinUrls = new Map<number, string>();
    data
      .slice(0, 10)
      .forEach((row, i) =>
        linkedinUrls.set(i, <string>(<Record<string, unknown>>row)['linkedin']),
      );
    return linkedinUrls;
  }
}
