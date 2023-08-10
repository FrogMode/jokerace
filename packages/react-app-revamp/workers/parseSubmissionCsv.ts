import { InvalidEntry, MAX_ROWS } from "@helpers/parseSubmissionsCsv";
import { getAddress } from "viem";

const processRowData = (row: any[]): { address: string; error: boolean } => {
  const address = row[0];
  let error = false;

  try {
    getAddress(address);
  } catch (e) {
    error = true;
  }

  return { address, error };
};

self.onmessage = (event: MessageEvent) => {
  const data = event.data as Array<any>;
  const addressData: string[] = [];
  const invalidEntries: InvalidEntry[] = [];
  const addresses: Set<string> = new Set();

  if (data.length > MAX_ROWS) {
    self.postMessage({
      data: [],
      invalidEntries,
      error: { kind: "limitExceeded" },
    });
    return;
  }

  const expectedColumns = 1;
  if (data[0].length !== expectedColumns) {
    self.postMessage({
      data: [],
      invalidEntries,
      error: { kind: "missingColumns" },
    });
    return;
  }

  for (const row of data) {
    const { address, error } = processRowData(row);

    if (addresses.has(address)) {
      self.postMessage({
        data: [],
        invalidEntries,
        error: { kind: "duplicates" },
      });
      return;
    } else {
      addresses.add(address);
    }

    if (error) {
      invalidEntries.push({ address, error });
    } else {
      addressData.push(address);
    }
  }

  self.postMessage({
    data: addressData,
    invalidEntries,
  });
};
