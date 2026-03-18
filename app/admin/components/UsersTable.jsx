export default function UsersTable({ users }) {

    return (
        <div className="bg-white shadow rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm">

                <thead className="bg-green-600">

                    <tr className="text-left text-white">
                        <th className="p-3">Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>

                </thead>

                <tbody>

                    {users.map(u => (
                        <tr key={u.id} className="border-t">

                            <td className="p-3">{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>

                        </tr>
                    ))}

                </tbody>

            </table>
        </div>

    )
}