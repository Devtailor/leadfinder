import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

import { GeneratedEmailsJson } from '../interfaces';

@Injectable()
export class XlsxService {
  getLinkedInUrls(amount = 10): Map<number, string> {
    const workbook = XLSX.readFile('src/data/sample-list.xlsx');
    const [sheetName] = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const linkedinUrls = new Map<number, string>();
    data
      .slice(0, amount)
      .forEach((row, i) =>
        linkedinUrls.set(i, <string>(<Record<string, unknown>>row)['linkedin']),
      );
    return linkedinUrls;
  }

  addEmailsToInputFile(emailsMap: Map<number, GeneratedEmailsJson>): Buffer {
    const headers = [
      'email',
      'full_name',
      'first_name',
      'last_name',
      'title',
      'company',
      'company_domain',
      'linkedin',
      'initial_email',
      'follow_up_email_1',
      'follow_up_email_2',
      'follow_up_email_3',
    ];
    const workbook = XLSX.readFile('src/data/sample-list.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const inputRows: InputRow[] = XLSX.utils.sheet_to_json(worksheet);

    const outputRows: OutputRow[] = inputRows.map((row, index) => {
      const generatedEmailsJson = emailsMap.get(index);
      return {
        ...row,
        initial_email: generatedEmailsJson?.initialEmail ?? '',
        follow_up_email_1: generatedEmailsJson?.followUpEmail1 ?? '',
        follow_up_email_2: generatedEmailsJson?.followUpEmail2 ?? '',
        follow_up_email_3: generatedEmailsJson?.followUpEmail3 ?? '',
      };
    });

    const newWorksheet = XLSX.utils.json_to_sheet(outputRows, {
      header: headers,
    });
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');

    return XLSX.write(newWorkbook, { type: 'buffer' });
  }
}

interface InputRow {
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  company_domain: string;
  linkedin: string;
}

interface OutputRow extends InputRow {
  initial_email: string;
  follow_up_email_1: string;
  follow_up_email_2: string;
  follow_up_email_3: string;
}
