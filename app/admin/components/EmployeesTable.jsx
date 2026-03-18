export default function EmployeesTable({ employees }) {

    return (

        <div className="bg-white shadow rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm">

                <thead className="bg-green-600">

                    <tr className="text-left text-white">
                        <th className="p-3">Name</th>
                        <th>Email</th>
                    </tr>

                </thead>

                <tbody>

                    {employees.map(e => (
                        <tr key={e.id} className="border-t">

                            <td className="p-3">{e.name}</td>
                            <td>{e.email}</td>

                        </tr>
                    ))}

                </tbody>

            </table>
        </div>
    )
}