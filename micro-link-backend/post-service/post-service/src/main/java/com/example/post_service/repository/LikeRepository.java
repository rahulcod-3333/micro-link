package com.example.post_service.repository;

import com.example.post_service.entity.PostLike;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<PostLike ,Long> {
    boolean existsByUserIdAndPostId(long userId, Long postId);
    @Transactional
    void deleteByUserIdAndPostId(Long userId, Long postId);
}
