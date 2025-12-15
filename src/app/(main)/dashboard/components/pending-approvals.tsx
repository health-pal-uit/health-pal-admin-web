interface PendingItem {
  id: number;
  title: string;
  type: string;
  user: string;
  calories: string;
}

interface PendingApprovalsProps {
  items: PendingItem[];
}

export const PendingApprovals = ({ items }: PendingApprovalsProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Pending Approvals</h2>

        <div className="overflow-x-auto mt-4">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="hover">
                  <td>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-base-content/60">
                      by {item.user}
                    </div>
                  </td>
                  <td>
                    <div className="badge badge-outline">{item.type}</div>
                  </td>
                  <td>{item.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
