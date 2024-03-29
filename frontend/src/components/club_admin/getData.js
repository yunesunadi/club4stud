export const getData = (attendanceByMember, clubMembers) => {
    let presentCount = [];

    attendanceByMember.forEach(schedule => {
        const scheduleId = schedule._id;
        schedule.attendance.forEach(attendance => {
            if (!presentCount[scheduleId]) {
                presentCount[scheduleId] = {
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

    const allMembersCount = clubMembers?.length;

    const data = schedulesPresent.map(({ schedule_id, description, count, created_at }) => {
        const percent = (count / allMembersCount) * 100;

        return {
            schedule_id,
            description,
            percent: parseFloat(percent.toFixed(2)),
            created_at
        };
    }).sort((a, b) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        return aTime - bTime;
    });

    return data;
}