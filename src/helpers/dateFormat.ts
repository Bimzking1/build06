import moment from 'moment';

moment.updateLocale('id-ID', {
  months: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ],
  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des'
  ],
  weekdays: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
});

moment.updateLocale('en-US', {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthsShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  weekdays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
});

export const generateFormattedDate = (
  dateString: string,
  showZone = false
): string => {
  const startDate = moment.utc(dateString);
  const result = startDate.format(
    `D ${showZone ? 'MMMM' : 'MMM'} YYYY, hh:00 ${showZone ? '(z)' : ''}`
  );
  return result;
};

export const generateFullDatetime = (dateString: string): string => {
  const startDate = moment.utc(dateString);
  const result = startDate.format('D/MM/YYYY, hh:mm:ss');

  return result;
};

export const getShortDate = (date: string): string => {
  const startDate = moment.utc(date);
  const result = startDate.format('DD-MM-YYYY');

  return result;
};

export const getTournamentTime = (
  dateStart: Date,
  dateEnd: Date,
  locale: 'id-ID' | 'en-US'
): string => {
  moment.locale(locale);

  const startTimeID = moment(dateStart).format('DD MMM YYYY, HH:mm');
  const endTimeID = moment(dateEnd).format('DD MMM YYYY, HH:mm');

  const startTimeEN = moment(dateStart).format('MMM DD, YYYY, HH:mm');
  const endTimeEN = moment(dateEnd).format('MMM DD, YYYY, HH:mm');

  return locale === 'id-ID'
    ? `${startTimeID} - ${endTimeID}`
    : `${startTimeEN} - ${endTimeEN}`;
};

export const formatMonthlyChart = (date: Date): string[] => {
  const months: string[] = [];

  const monthOffset = date.getMonth() + 1;
  const monthAbbreviations = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(date.getFullYear(), i, 1);
    return month.toLocaleString('default', { month: 'short' });
  });

  for (let i = 0; i < 6; i++) {
    const previousMonthIndex = (monthOffset - (2 * i + 1) + 12) % 12;
    const monthAbbreviation = monthAbbreviations[previousMonthIndex];
    months.push(monthAbbreviation);
  }
  return months.reverse();
};

export const getLastUpdated = (
  date: Date,
  locale: 'id-ID' | 'en-US'
): string => {
  moment.locale(locale);

  return locale === 'id-ID'
    ? moment(date).format('DD MMMM YYYY - HH:mm')
    : moment(date).format('MMMM DD, YYYY - HH:mm');
};

export const getEventDate = (date: Date, locale: 'id-ID' | 'en-US'): string => {
  moment.locale(locale);

  return locale === 'id-ID'
    ? moment(date).format('DD MMMM YYYY - HH:mm')
    : moment(date).format('MMMM DD, YYYY - HH:mm');
};

export const getEventDetailsDate = (
  date: Date,
  locale: 'id-ID' | 'en-US'
): string => {
  moment.locale(locale);

  return locale === 'id-ID'
    ? moment(date).format('dddd, DD MMMM YYYY')
    : moment(date).format('dddd, MMMM DD, YYYY');
};

export const getEventClock = (eventDate: Date, endedAt: Date): string => {
  const startTime = moment(eventDate).format('HH:mm');
  const endTime = moment(endedAt).format('HH:mm');

  return `${startTime} - ${endTime}`;
};

export const getEarningDate = (
  date: Date,
  locale: 'id-ID' | 'en-US'
): string => {
  moment.locale(locale);
  return moment(date).format('DD MMMM YYYY');
};

export const getEarningReceiptDate = (
  date: Date,
  locale: 'id-ID' | 'en-US'
): string => {
  moment.locale(locale);
  return moment(date).format('DD MMMM YYYY HH:mm:ss');
};

export const getBattlePeriod = (date: Date): string => {
  return moment(date).format('DD/MM/YYYY');
};

export const getBattleStageDate = (date: string): string => {
  return moment(date).format('D MMM YYYY HH:mm');
};
