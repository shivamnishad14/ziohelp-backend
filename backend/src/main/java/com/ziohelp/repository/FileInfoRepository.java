package com.ziohelp.repository;

import com.ziohelp.entity.FileInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FileInfoRepository extends JpaRepository<FileInfo, Long> {
    List<FileInfo> findByProductId(Long productId);
    List<FileInfo> findByTicketId(Long ticketId);
    List<FileInfo> findByKbArticleId(Long kbArticleId);
    List<FileInfo> findByFaqId(Long faqId);
} 