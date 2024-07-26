import React, { useState, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function Page() {
    const [fetchedData, setFetchedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch random activities 15 times
            const fetchPromises = Array.from({ length: 15 }, () =>
                fetch('https://bored-api.appbrewery.com/random')
            );

            // Wait for all fetch requests to complete
            const responses = await Promise.all(fetchPromises);

            // Check for error status and parse JSON data
            const data = await Promise.all(responses.map(async (response) => {
                if (response.status === 429) {
                    throw new Error('Error 429: Too Many Requests');
                }
                return response.json();
            }));

            // Set fetched data
            setFetchedData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Convert data to CSV format
    const convertToCSV = (data) => {
        const header = [
            'Index', 'Activity', 'Availability', 'Type', 'Participants',
            'Price', 'Accessibility', 'Duration', 'Kid Friendly', 'Link', 'Key'
        ].join(',');

        const rows = data.map((item, index) =>
            [
                index + 1, item.activity, item.availability, item.type,
                item.participants, item.price, item.accessibility,
                item.duration, item.kidFriendly, item.link, item.key
            ].join(',')
        );

        return [header, ...rows].join('\n');
    };

    // Handle CSV download
    const downloadCSV = () => {
        const csv = convertToCSV(fetchedData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'Random Activities.csv');
    };

    // Handle JSON download
    const downloadJSON = () => {
        const blob = new Blob([JSON.stringify(fetchedData, null, 2)], { type: 'application/json;charset=utf-8;' });
        saveAs(blob, 'Random Activities.json');
    };

    // Print data to console
    const printToConsole = () => {
        console.log('Fetched Data:', fetchedData);
    };

    return (
        <div className="App m-3 sm:mx-5 sm:my-2 md:my-5 md:mx-10">
            <div className="md:flex md:justify-between md:items-center">
                <h1 className="text-2xl font-bold mb-4 min-sm:text-sm text-[#181719]">Random Activities</h1>
                <div className="mb-4">
                    <button
                        onClick={downloadCSV}
                        className="px-4 py-2 bg-[#758694] text-white rounded mr-2 text-sm w-[146px]"
                    >
                        Download CSV
                    </button>
                    <button
                        onClick={downloadJSON}
                        className="px-4 py-2 bg-[#758694] text-white rounded mr-2 text-sm w-[146px]"
                    >
                        Download JSON
                    </button>
                    <button
                        onClick={printToConsole}
                        className="px-4 py-2 bg-[#758694] text-white rounded text-sm w-[146px]"
                    >
                        Print to Console
                    </button>
                </div>
            </div>
            
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-[#FFF8F3] h-[300px]">
                    <thead className="text-xs text-[#FFF8F3] uppercase bg-[#405D72]">
                        <tr>
                            <th scope="col" className="px-3 py-2">No.</th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Activity</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Availability</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Type</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Participants</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Price</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Accessibility</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Duration</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Kid Friendly</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Link</div>
                            </th>
                            <th scope="col" className="px-3 py-2">
                                <div className="flex items-center">Key</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="11" className="text-center py-5">
                                    <div className="flex justify-center items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-[#405D72] rounded-full animate-spin"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="11" className="text-center text-red-500 py-5 font-bold">
                                    {error}. Please try again later.
                                </td>
                            </tr>
                        ) : (
                            fetchedData.map((item, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-3 py-2 font-medium text-[#FFF8F3] whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </td>
                                    <td className="px-3 py-2">{item.activity}</td>
                                    <td className="px-3 py-2">{item.availability}</td>
                                    <td className="px-3 py-2">{item.type}</td>
                                    <td className="px-3 py-2">{item.participants}</td>
                                    <td className="px-3 py-2">{item.price}</td>
                                    <td className="px-3 py-2">{item.accessibility}</td>
                                    <td className="px-3 py-2">{item.duration}</td>
                                    <td className="px-3 py-2">{item.kidFriendly ? 'Yes' : 'No'}</td>
                                    <td className="px-3 py-2">{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer">{item.link}</a> : 'N/A'}</td>
                                    <td className="px-3 py-2">{item.key}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
