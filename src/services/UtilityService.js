class UtilityService {

    static checkEmpty(obj) {
        if (obj === undefined || obj === null || obj === {} || obj === []) {
            return true;
        }
        if (typeof obj === "string" || typeof obj === "number") {
            return obj.toString().trim().length === 0;
        }
        for (let key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    static roundOffValue(value, precision) {
        let multiplier = Math.pow(10, precision || 0);
        return Math.round(Number(value) * multiplier) / multiplier;
    }

    static getJSON(data) {
        let result = {};
        try {
            if (!UtilityService.checkEmpty(data)) {
                result = JSON.parse(data);
            }
            return result;
        } catch (e) {
            return result;
        }
    }

    static getMonthNameFromIndex(index) {
        return UtilityService.months[index];
    }


    static formatDate(date, format) {
        if (date == null) {
            return '';
        }
        let time = new Date(date);
        let yyyy = time.getFullYear();
        let yy = (yyyy + "").substring(2);
        let MM = time.getMonth() + 1;
        let dd = time.getDate();
        let hh = time.getHours();
        let mm = time.getMinutes();
        let ss = time.getSeconds();
        let DD = time.getDay();
        const A = hh < 12 ? "AM" : "PM";
        if (format.indexOf("A") > -1) {
            hh = hh > 12 ? hh - 12 : hh;
        }
        MM = MM < 10 ? "0" + MM : MM;
        dd = dd < 10 ? "0" + dd : dd;
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        format = format.replace("A", A);
        format = format.replace("yyyy", yyyy);
        format = format.replace("yy", yy);
        format = format.replace("MMM", UtilityService.months[MM - 1]);
        format = format.replace("MM", MM);
        format = format.replace("dd", dd);
        format = format.replace("hh", hh);
        format = format.replace("mm", mm);
        format = format.replace("ss", ss);
        const day = UtilityService.days[DD];
        format = format.replace("DDD", day.substring(0, 3));
        format = format.replace("DD", UtilityService.days[DD]);
        return format;
    }

    static isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    }

    static isInt(n) {
        return n % 1 === 0;
    }

    static isTrue(data) {
        return data === "true" || data === true;
    }

    static isFalse(data) {
        return data === "false" || data === false;
    }

    static isNumeric(str) {
        if (typeof str !== "string") {
            return false;
        } // we only process strings!
        return (
            !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str))
        ); // ...and ensure strings of whitespace fail
    }

    static getDayDiffInMinutes(date1, date2) {
        const diff = Math.abs(new Date(date1) - new Date(date2));
        const minutes = Math.floor((diff / 1000) / 60);
        return minutes;
    }

    static getDayDiffInHoursMinSec(date1, date2) {
        const h = parseInt(this.getDayDiffInMinutes(date1, date2) / 60);
        const m = parseInt(this.getDayDiffInMinutes(date1, date2) % 60);
        const s = (Math.abs(new Date(date1) - new Date(date2)) / 1000) % 60;
        return { h, m, s };
    }

    static getHHMMDayDiff(date1, date2) {
        const minutes = UtilityService.getDayDiffInMinutes(date1, date2);
        return `${Math.floor(minutes / 60)}/${minutes % 60}`;
    }

    static getAttendanceStatusData(type) {
        const data = UtilityService.attendanceStatus[type];
        if (!UtilityService.checkEmpty(data)) {
            return data;
        }
        return {
            shortCode: "NA",
            textColor: "#D85B00",
            backGroundColor: "#FFC89F",
        };
    }

    static getDayFromDate(date) {
        const d = new Date(date);
        const dayName = days[d.getDay()];
        return dayName.substring(0, 3).toUpperCase();
    }

    static getLabelFromStatus(status) {
        return status.replace("_", " ");
    }

    static getNameInitials(name) {
        if (name == null) {
            return '';
        }
        return name.split(" ").map(function (part) { return part.substring(0, 1) }).join("").toUpperCase();
    }

    static convertTo24HourFormat(dateString) {
        if (dateString == null) {
            return '';
        }
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    static removeString(str) {
        if (str?.includes('(oufastupdates.com)') || str?.includes('.pdf')) {
            const text = str.replace(/\(oufastupdates.com\)|\.pdf/g, '');
            return text.slice(0, 35) + '...';
        }
        if (str?.length > 15) {
            return str.slice(0, 5) + '...';
        }
        return str;
    }

    static replaceString(str, placeholdersValues) {
        const placeholders = ['${university}', '${course}', '${branch}', '${sem}', '${category}', '${name}', '${subject}', '${did}', '${uid}', '${uid2}', '${uid3}'];

        let replacedStr = str;

        for (const placeholder of placeholders) {
            if (str !== null && str.includes(placeholder)) {
                const index = placeholders.indexOf(placeholder);
                replacedStr = replacedStr.replace(placeholder, placeholdersValues[index]);
            }
        }
        return replacedStr;
    }

    static replaceUnusualCharacters(str, character) {
        if (str?.includes(character)) {
            const text = str?.replace(character, '_');
            return text;
        }
        return str;
    }


}
export default UtilityService;
