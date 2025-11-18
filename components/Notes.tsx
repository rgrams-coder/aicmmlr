import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Note } from '../types';
import DocumentTextIcon from './icons/DocumentTextIcon';
import TrashIcon from './icons/TrashIcon';

interface NotesProps {
  onClose: () => void;
}

const Notes: React.FC<NotesProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await apiService.getNotes();
        setNotes(response.notes);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await apiService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note._id !== noteId));
    } catch (error) {
      alert('Failed to delete note');
    }
  };

  const handlePrintNote = (note: Note) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Note - ${note.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1a3b5d; border-bottom: 2px solid #1a3b5d; padding-bottom: 10px; }
              .date { color: #666; font-size: 14px; margin-bottom: 20px; }
              .content { line-height: 1.6; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${note.title}</h1>
            <div class="date">Created: ${new Date(note.createdAt).toLocaleDateString()}</div>
            <div class="content">${note.content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        <div className="bg-brand-dark p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">My Notes</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-secondary mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DocumentTextIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No notes saved yet</p>
              <p className="text-sm mt-2">Start taking notes in the Digital Library</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note._id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{note.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePrintNote(note)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Print Note"
                      >
                        🖨️
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Note"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap mb-2">{note.content}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;