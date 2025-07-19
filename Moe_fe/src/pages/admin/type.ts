export interface ActivityLog {
    code: string;
    type: string; // get/post/put/delete/path
    ip: string; // ip user
    responseCode: string; // 200, 500, 400, 404...
    message: string; // sự kiện gì
    error: string; // lỗi cụ thể
    data: string; // data json của request đó
    userCode: string; // mã người dùng thực hiện request
    createdAt: string;
}


export interface UserActivity {
    userCode: string;
    displayName: string;
    ip: string;
    firstAccessTime: string; // or Date, depending on your usage
}