export default function StudentsTable({ students }) {

    return (
        <div className="bg-white shadow rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm">

                <thead className="bg-green-600">

                    <tr className="text-left text-white">
                        <th className="p-3">Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Course</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {students.map(s => (
                        <tr key={s.student_id} className="border-t">

                            <td className="p-3">{s.student_id}</td>
                            <td>{s.name}</td>
                            <td>{s.email}</td>
                            <td>{s.phone}</td>
                            <td>{s.course_slug}</td>
                            <td>{s.payment_status}</td>

                        </tr>
                    ))}

                </tbody>

            </table>
        </div>
    )
}