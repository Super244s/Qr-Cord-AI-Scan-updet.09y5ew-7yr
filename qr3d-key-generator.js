/**
 * ==========================================
 * 🔑 QR3D Font — ระบบสร้างคีย์
 * คีย์หลักปลดล็อค: superneng244.GENAI
 * สร้างคีย์ได้ไม่จำกัด ตรวจสอบลำดับอัตโนมัติ
 * เจ้าของสิทธิ์: Thanva Phupingbut 244
 * ==========================================
 */

const fs = require('fs');
const path = require('path');

class QR3DKeySystem {
  constructor() {
    this.MASTER_KEY_PREFIX = "superneng244.GENAI";
    this.KEY_STORAGE = path.join(__dirname, 'issued-keys.json');
    this.keyCounter = this.loadCounter();
    this.issuedKeys = this.loadKeys();
  }

  /**
   * 🔐 ตรวจสอบคีย์หลักก่อนเข้าใช้งานระบบ
   */
  verifyMasterKey(inputKey) {
    return inputKey === this.MASTER_KEY_PREFIX;
  }

  /**
   * 📥 โหลดข้อมูลลำดับและรายการคีย์ที่ออกไปแล้ว
   */
  loadCounter() {
    try {
      const data = fs.readFileSync(this.KEY_STORAGE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.lastIndex || 0;
    } catch {
      return 0;
    }
  }

  loadKeys() {
    try {
      const data = fs.readFileSync(this.KEY_STORAGE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.keys || [];
    } catch {
      return [];
    }
  }

  /**
   * 📝 บันทึกข้อมูลอัตโนมัติทุกครั้งที่สร้างคีย์
   */
  saveData() {
    fs.writeFileSync(this.KEY_STORAGE, JSON.stringify({
      lastIndex: this.keyCounter,
      keys: this.issuedKeys,
      updatedAt: new Date().toISOString()
    }, null, 2));
  }

  /**
   * ✨ สร้างคีย์ใหม่ตามลำดับ — ไม่จำกัดจำนวน
   */
  generateNewKey(masterKeyInput) {
    if (!this.verifyMasterKey(masterKeyInput)) {
      return {
        success: false,
        error: "❌ คีย์หลักไม่ถูกต้อง — ไม่มีสิทธิ์สร้างคีย์ใหม่"
      };
    }

    this.keyCounter++;
    const sequence = String(this.keyCounter).padStart(6, '0');
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newKey = `Q3D-ACCESS-${sequence}-${randomPart}`;

    this.issuedKeys.push({
      order: this.keyCounter,
      key: newKey,
      createdAt: new Date().toISOString(),
      status: "พร้อมใช้งาน"
    });

    this.saveData();

    return {
      success: true,
      message: "✅ สร้างคีย์สำเร็จ",
      masterUsed: this.MASTER_KEY_PREFIX,
      sequence: this.keyCounter,
      totalIssued: this.keyCounter,
      newKey: newKey
    };
  }

  /**
   * 📋 ดูรายการคีย์ทั้งหมดที่ออกไปแล้ว
   */
  listAllKeys(masterKeyInput) {
    if (!this.verifyMasterKey(masterKeyInput)) {
      return { success: false, error: "❌ ไม่มีสิทธิ์ดูรายการคีย์" };
    }
    return {
      success: true,
      totalCount: this.keyCounter,
      keys: [...this.issuedKeys]
    };
  }
}

// ==========================================
// 🚀 ตัวอย่างการใช้งาน
// ==========================================
const keySystem = new QR3DKeySystem();

// 👉 สร้างคีย์ใหม่ (ใส่คีย์หลัก: superneng244.GENAI)
const result = keySystem.generateNewKey("superneng244.GENAI");
console.log(result);

// 👉 ดูรายการคีย์ทั้งหมด
// console.log(keySystem.listAllKeys("superneng244.GENAI"));

module.exports = QR3DKeySystem;
