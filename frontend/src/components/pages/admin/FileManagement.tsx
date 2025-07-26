import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  useUploadFile, 
  useListFiles, 
  useDeleteFile,
  useDownloadFile
} from '@/hooks/api/useFiles';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { AxiosProgressEvent } from 'axios';

interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Queries
  const { data: files, isLoading } = useListFiles();

  // Mutations
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  // Handlers
  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploads: FileUpload[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploads(prev => [...prev, ...newUploads]);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const uploadIndex = uploads.length + i;

      try {
        const formData = new FormData();
        formData.append('file', file);

        await uploadFile.mutateAsync({
          formData,
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
            setUploads(prev => prev.map((upload, index) => 
              index === uploadIndex ? { ...upload, progress } : upload
            ));
          }
        });

        setUploads(prev => prev.map((upload, index) => 
          index === uploadIndex ? { ...upload, status: 'success', progress: 100 } : upload
        ));

        toast(`${file.name} uploaded successfully`);
      } catch (error) {
        setUploads(prev => prev.map((upload, index) => 
          index === uploadIndex ? { 
            ...upload, 
            status: 'error', 
            error: 'Upload failed' 
          } : upload
        ));

        toast(`Failed to upload ${file.name}`);
      }
    }

    // Clear uploads after 5 seconds
    setTimeout(() => {
      setUploads([]);
    }, 5000);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDownloadFile = async (filename: string) => {
    try {
      const response = await downloadFile.mutateAsync(filename);
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast("File downloaded successfully");
    } catch (error) {
      toast("Failed to download file");
    }
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      await deleteFile.mutateAsync(filename);
      toast("File deleted successfully");
    } catch (error) {
      toast("Failed to delete file");
    }
  };

  // Helper function for file icons
  function getFileIcon(filename: string) {
    if (!filename) return '📁';
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📈';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'mp4':
      case 'avi':
      case 'mov': return '🎥';
      case 'mp3':
      case 'wav': return '🎵';
      case 'zip':
      case 'rar': return '📦';
      default: return '📁';
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File Management</h1>
          <p className="text-muted-foreground">
            Upload, manage, and organize files
          </p>
        </div>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          Upload Files
        </Button>
      </div>

      <Separator />

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploads.map((upload, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{upload.file.name}</span>
                    <Badge variant={upload.status === 'success' ? 'default' : upload.status === 'error' ? 'destructive' : 'secondary'}>
                      {upload.status}
                    </Badge>
                  </div>
                  <Progress value={upload.progress} className="w-full" />
                  {upload.error && (
                    <p className="text-sm text-destructive">{upload.error}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <FilesTable 
            files={files}
            isLoading={isLoading}
            onView={(file) => {
              setSelectedFile(file);
              setIsPreviewDialogOpen(true);
            }}
            onDownload={handleDownloadFile}
            onDelete={handleDeleteFile}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <FilesTable 
            files={files?.content?.filter((f: any) => 
              ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(f.filename.split('.').pop()?.toLowerCase())
            )}
            isLoading={false}
            onView={() => {}}
            onDownload={() => {}}
            onDelete={() => {}}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <FilesTable 
            files={files?.content?.filter((f: any) => 
              ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(f.filename.split('.').pop()?.toLowerCase())
            )}
            isLoading={false}
            onView={() => {}}
            onDownload={() => {}}
            onDelete={() => {}}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <FilesTable 
            files={files?.content?.filter((f: any) => 
              ['mp4', 'avi', 'mov', 'mp3', 'wav', 'flac'].includes(f.filename.split('.').pop()?.toLowerCase())
            )}
            isLoading={false}
            onView={() => {}}
            onDownload={() => {}}
            onDelete={() => {}}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="archives" className="space-y-4">
          <FilesTable 
            files={files?.content?.filter((f: any) => 
              ['zip', 'rar', '7z', 'tar', 'gz'].includes(f.filename.split('.').pop()?.toLowerCase())
            )}
            isLoading={false}
            onView={() => {}}
            onDownload={() => {}}
            onDelete={() => {}}
            getFileIcon={getFileIcon}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {files && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: files.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(files.totalPages - 1, currentPage + 1))}
                className={currentPage === files.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>
              Drag and drop files here or click to select files.
            </DialogDescription>
          </DialogHeader>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="text-4xl">📁</div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or
                </p>
                <Label htmlFor="file-upload" className="cursor-pointer text-primary hover:underline">
                  click to select files
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.filename}</DialogTitle>
            <DialogDescription>
              File ID: #{selectedFile?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getFileIcon(selectedFile?.filename)}</span>
              <div>
                <p className="font-medium">{selectedFile?.filename}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile?.size)} • {formatDate(selectedFile?.uploadDate)}
                </p>
              </div>
            </div>
            
            {/* File Preview */}
            <div className="border rounded-lg p-4 bg-muted/25">
              {selectedFile?.filename && (
                <FilePreview file={selectedFile} />
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => handleDownloadFile(selectedFile?.filename)}>
                Download
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the file.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteFile(selectedFile?.filename)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Files Table Component
const FilesTable: React.FC<{
  files?: any;
  isLoading: boolean;
  onView: (file: any) => void;
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  getFileIcon: (filename: string) => string;
  formatFileSize: (bytes: number) => string;
  formatDate: (dateString: string) => string;
}> = ({ files, isLoading, onView, onDownload, onDelete, getFileIcon, formatFileSize, formatDate }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          {files?.totalElements || files?.length || 0} files found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files?.content?.map((file: any) => (
              <TableRow key={file.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.filename)}</span>
                    <div>
                      <p className="font-medium">{file.filename}</p>
                      <p className="text-sm text-muted-foreground">#{file.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {file.filename.split('.').pop()?.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(file.uploadDate)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onView(file)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDownload(file.filename)}>
                      Download
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the file.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(file.filename)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// File Preview Component
const FilePreview: React.FC<{ file: any }> = ({ file }) => {
  if (!file || !file.filename) return null;
  const extension = file.filename.split('.').pop()?.toLowerCase();
    
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
    return (
      <div className="text-center">
        <img 
          src={`/api/v1/files/${file.filename}`} 
          alt={file.filename}
          className="max-w-full max-h-64 mx-auto rounded"
        />
      </div>
    );
  }
  
  if (['pdf'].includes(extension)) {
    return (
      <div className="text-center">
        <iframe 
          src={`/api/v1/files/${file.filename}`}
          className="w-full h-64 border rounded"
          title={file.filename}
        />
      </div>
    );
  }
  
  if (['mp4', 'avi', 'mov'].includes(extension)) {
    return (
      <div className="text-center">
        <video 
          controls 
          className="max-w-full max-h-64 mx-auto rounded"
        >
          <source src={`/api/v1/files/${file.filename}`} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  
  if (['mp3', 'wav', 'flac'].includes(extension)) {
    return (
      <div className="text-center">
        <audio controls className="w-full">
          <source src={`/api/v1/files/${file.filename}`} type={`audio/${extension}`} />
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }
  
  function getFileIcon(filename: any): React.ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">{getFileIcon(file.filename)}</div>
      <p className="text-muted-foreground">Preview not available for this file type</p>
    </div>
  );
};

export default FileManagement; 