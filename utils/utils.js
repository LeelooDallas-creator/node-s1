import dayjs from 'dayjs';
import 'dayjs/locale/fr.js';

dayjs.locale('fr');

export function formatDate(dateStr) {
    return dayjs(dateStr).format('DD MMMM YYYY');
}
