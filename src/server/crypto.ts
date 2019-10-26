// Copyright (C) 2019 ModZero <modzero@modzero.xyz>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { randomBytes, secretbox } from "tweetnacl";
import {
  decodeBase64,
  decodeUTF8,
  encodeBase64,
  encodeUTF8
} from "tweetnacl-util";

const secret = decodeBase64(process.env.SECRET);
const newNonce = () => randomBytes(secretbox.nonceLength);
const secretBoxKey = secret.slice(0, secretbox.keyLength);
if (secretBoxKey.length !== secretbox.keyLength) {
  throw new Error("Secret too short to encrypt anything");
}

export const box = (json: any, key: Uint8Array = secretBoxKey) => {
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(JSON.stringify(json));
  const encrypted = secretbox(messageUint8, nonce, key);
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);

  return encodeBase64(fullMessage);
};

export const unbox = (
  messageWithNonce: string,
  key: Uint8Array = secretBoxKey
) => {
  const fullMessageUint8 = decodeBase64(messageWithNonce);
  const nonce = fullMessageUint8.slice(0, secretbox.nonceLength);
  const message = fullMessageUint8.slice(
    secretbox.nonceLength,
    fullMessageUint8.length
  );

  const decrypted = secretbox.open(message, nonce, key);
  return JSON.parse(encodeUTF8(decrypted));
};
