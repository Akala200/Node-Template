import multer from "multer";
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "/firmare/updates/");
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

const upload = multer({ storage: storage });