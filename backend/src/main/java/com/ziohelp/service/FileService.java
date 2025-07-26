package com.ziohelp.service;

import com.ziohelp.entity.FileInfo;
import com.ziohelp.repository.FileInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FileService {
    @Autowired
    private FileInfoRepository repository;

    public FileInfo save(FileInfo fileInfo) {
        return repository.save(fileInfo);
    }

    public Optional<FileInfo> get(Long id) {
        return repository.findById(id);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<FileInfo> listAll() {
        return repository.findAll();
    }

    public List<FileInfo> listByProduct(Long productId) {
        return repository.findByProductId(productId);
    }

    public List<FileInfo> listByTicket(Long ticketId) {
        return repository.findByTicketId(ticketId);
    }

    public List<FileInfo> listByKbArticle(Long kbArticleId) {
        return repository.findByKbArticleId(kbArticleId);
    }

    public List<FileInfo> listByFaq(Long faqId) {
        return repository.findByFaqId(faqId);
    }
} 