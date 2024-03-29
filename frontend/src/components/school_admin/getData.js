export const getData = (allAttendanceByMember, clubs) => {
    let presentCount = [];
    let allOverallPercent = [];

    allAttendanceByMember.forEach(club => {
        const clubId = club._id;
        club.schedules.forEach(schedule => {

            const scheduleId = schedule._id;
            schedule.attendance.forEach(attendance => {
                if (!presentCount[scheduleId]) {
                    presentCount[scheduleId] = {
                        club_id: clubId,
                        schedule_id: scheduleId,
                        description: schedule.description,
                        count: 0,
                        created_at: schedule.created_at
                    };
                }

                if (attendance.present) {
                    presentCount[scheduleId].count++;
                }
            });
        });

        const schedulesPresent = Object.keys(presentCount).map(scheduleId => {
            return presentCount[scheduleId];
        });

        const clubsPresent = schedulesPresent.filter(({ club_id }) => clubId === club_id);

        const allMembersCount = clubs?.find(({ _id }) => clubId === _id).members.length;

        const data = clubsPresent.map(({ club_id, count }) => {
            const percent = (count / allMembersCount) * 100;

            return {
                club_id,
                percent: parseFloat(percent.toFixed(2)),
            };
        });

        const percentSum = data.reduce((previousValue, currentValue) => previousValue + currentValue.percent, 0.0).toFixed(2);
        const overallPercent = { _id: clubId, name: clubs.find(({ _id }) => clubId === _id)?.name, percent: parseFloat((percentSum / data.length).toFixed(2)) };

        allOverallPercent.push(overallPercent)
    });

    const sortedResult = allOverallPercent.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    return sortedResult;
}