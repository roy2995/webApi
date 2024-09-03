const db = require('../../DB/mysql');
const cloudinary = require('../../cloudinary');

const TABLE = 'attendance';

async function getAll() {
    return db.all(TABLE);
}

async function getAttendance(id) {
    return db.user(TABLE, id);
}

async function createAttendance(data) {
    let imageUrl = null;

    if (data.image_data) {
        const result = await cloudinary.uploader.upload(data.image_data, {
            folder: 'attendance_images',
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });

        imageUrl = result.secure_url;
    }

    const attendanceData = {
        user_id: data.user_id,
        check_in: data.check_in,
        check_out: data.check_out,
        image_data: imageUrl,
        created_at: new Date()
    };

    return db.newUser(TABLE, attendanceData);
}

async function deleteAttendance(id) {
    return db.delet(TABLE, 'id = ?', [id]);
}

module.exports = {
    getAll,
    getAttendance,
    createAttendance,
    deleteAttendance
};
