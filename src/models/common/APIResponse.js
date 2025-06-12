export default class APIResponse {
  
  code = null;
  data = null;
  message = null;

  constructor(code, data, message){
    this.code = code;
    this.data = data;
    this.message = message;
  }

  // JSON 문자열로 변환
  json() {
    return {
      code: this.code,
      data: this.data,
      message: this.message,
    };
  }

  /**
   * JSON에서 객체로 복원
   * @param {string | object} json JSON 객체 또는 JSON 형태의 문자열
   * @returns 
   */
  static from(json) {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    return new APIResponse(obj.code, obj.data, obj.message);
  }
}